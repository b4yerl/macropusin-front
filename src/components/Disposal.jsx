import axios from 'axios';
import "../styles/ItemsList.css";
import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function Disposal() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    motivo: '',
    preco: '',
    precoVenda: '',
    dataCompra: '',
    dataDescarte: '',
    dataVenda: ''
  });

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3333/itens");
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3333/itens/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'preco' || name === 'precoVenda') {
      const regex = /^[0-9]*,?[0-9]*$/;
      if (regex.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      const finalForm = { 
        ...formData, 
        preco: Number(formData.preco.replace(/[^0-9,-]+/g,"").replace(',', '.')), 
        precoVenda: Number(formData.precoVenda.replace(/[^0-9,-]+/g,"").replace(',', '.')),
        dataDescarte: today, 
        dataCompra: new Date(formData.dataCompra),
        dataVenda: new Date(formData.dataVenda)
      };
      await axios.post('http://localhost:3333/itens', finalForm);
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCSV = (csv, filename) => {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const generateCsv = async () => {
    const filename = 'descarte-' + moment().format('YYYY-MM-DD-HH:mm:ss') + '.csv';
    const csv = [];
    for (let i = 0; i < items.length; i++) {
      const headers = [];
      const row = [];
      const cols = items[i];
      for (let key in cols) {
        if (key === '_id') continue;
        row.push(cols[key]);
        if (i === 0) { headers.push(key); }
      }
      if (i === 0) { csv.push(headers.join(';')); }
      csv.push(row.join(';'));
    }
    downloadCSV(csv.join('\n'), filename);
  };

  return (
    <div className='container'>
      
      <div className='tableContainer'>
        <div className='tabs'>
          <button className='tabBtn' onClick={() => setIsModalOpen(true)}>Cadastrar novo descarte</button>
          <button className='tabBtn' onClick={() => generateCsv()}>Gerar CSV</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Motivo</th>
              <th>Data do Descarte</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.nome}</td>
                <td>{item.motivo}</td>
                <td>{moment(item.dataDescarte).format('DD-MM-YYYY')}</td>
                <td>
                  <button className='deleteBtn' onClick={() => handleDelete(item._id)}>Deletar</button>
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
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="motivo">Motivo</label>
              <input
                type="text"
                name="motivo"
                placeholder="Motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="preco">Preço</label>
              <input
                type="text"
                name="preco"
                placeholder="Preço"
                value={formData.preco}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="precoVenda">Preço da venda</label>
              <input
                type="text"
                name="precoVenda"
                placeholder="Preço de Venda"
                value={formData.precoVenda}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="dataCompra">Data da compra</label>
              <input
                type="date"
                name="dataCompra"
                placeholder='Data de Aquisição'
                value={formData.dataCompra}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="dataVenda">Data da venda</label>
              <input
                type="date"
                name="dataVenda"
                placeholder='Data de Venda'
                value={formData.dataVenda}
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
  );
}
