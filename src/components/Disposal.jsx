import axios from 'axios';
import "../styles/ItemsList.css"
import React, { useEffect, useState } from 'react';

export default function Disposal() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    motivo: '',
    preco: '',
    precoVenda: '',
    dataCompra: ''
  });
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3333/itens");
      setItems(response.data);
    }
    fetchData();
  }, [])

  const handleDelete = async (id) => {
      await axios.delete(`http://localhost:3333/itens/${id}`);
      setItems(items.filter(item => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const finalForm = { ...formData, dataDescarte: today, dataCompra: new Date(formData.dataCompra) };
    const response = await axios.post('http://localhost:3333/itens', finalForm);
    window.location.reload();
  }
  
  return (
    <div className='container'>
      <div className='tabs'>
        <button className='tabBtn' onClick={() => setIsModalOpen(true)}>Cadastrar novo descarte</button>
        <button className='tabBtn'>Gerar CSV</button>
      </div>
      <div className='tableContainer'>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Motivo</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.motivo}</td>
                <td>{new Date(item.dataDescarte).toLocaleDateString()}</td>
                <td>
                  <button className='deleteBtn' onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h2>Novo Descarte</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="motivo"
                placeholder="Motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="preco"
                placeholder="Preço"
                value={formData.preco}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="precoVenda"
                placeholder="Preço de Venda"
                value={formData.precoVenda}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="dataCompra"
                placeholder='Data de Aquisição'
                value={formData.dataCompra}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Cadastrar</button>
              <button className='cancelButton' type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}