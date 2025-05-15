"use client";
import styles from './PreorderPage.module.css';
import { useEffect, useState } from 'react';

export default function PreorderPage() {

  const [formVisible, setFormVisible] = useState(false);
  const [preorders, setPreorders] = useState([]);
  const [order_date, setOrderDate ] = useState('');
  const [order_by, setOrderBy ] = useState('');
  const [selected_package, setSelectedPackage ]= useState('');
  const [qty, setQty ] = useState('');
  const [status, setStatus ] = useState('');
  const [msg, setMsg ] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchPreorders = async () => {
    const res = await fetch('/api/preorder');
    const data = await res.json();
    setPreorders(data);
    };

    useEffect(() => {
        fetchPreorders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/preorder/${editId}` : '/api/preorder';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_date, order_by, selected_package, qty: Number(qty), status }),
        });

        if (res.ok) {
            setMsg('Berhasil disimpan');
            setOrderDate('');
            setOrderBy('');
            setSelectedPackage('');
            setQty('');
            setStatus('');
            setEditId(null);
            setFormVisible(false);
            fetchPreorders(); // refresh data
        } else {
            setMsg('Gagal menyimpan data');
        }
    };

    const handleEdit = (item) => {
        setOrderDate(item.order_date);
        setOrderBy(item.order_by);
        setSelectedPackage(item.selected_package);
        setQty(item.qty);
        setStatus(item.status === "Lunas" ? "Lunas" : "Belum Lunas");
        setEditId(item.id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus data ini?')) return;

        await fetch(`/api/preorder/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        fetchPreorders();
    };

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input Data Baru</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Tanggal Pesanan</span>
                    <input
                    type="date"
                    value={order_date}
                    onChange={(e) => setOrderDate(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Nama Pemesan</span>
                    <input
                    type="text"
                    value={order_by}
                    onChange={(e) => setOrderBy(e.target.value)}
                    placeholder="Masukkan Nama Pemesan"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Paket</span>
                    <select 
                        value={selected_package}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        required
                    >
                        <option value="">Pilih Paket</option>
                        <option value="Paket 1">Paket 1</option>
                        <option value="Paket 2">Paket 2</option>
                        <option value="Paket 3">Paket 3</option>
                        <option value="Paket 4">Paket 4</option>
                        <option value="Paket 5">Paket 5</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <span>Jumlah</span>
                    <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Input Jumlah"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Status</span>
                    <label>
                    <input
                    type="radio"
                    value="Lunas"
                    checked={status === "Lunas"}
                    onChange={(e) => setStatus(e.target.value)}
                    />
                    Lunas
                </label>
                <label>
                    <input
                    type="radio"
                    value="Belum Lunas"
                    checked={status === "Belum Lunas"}
                    onChange={(e) => setStatus(e.target.value)}
                    />
                    Belum Lunas
                </label>
                </div>
                <button type="submit">
                    Simpan
                </button>
                <p>{msg}</p>
                </form>
            </div>
        )}

        <div className={styles.tableWrapper}>
            <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Tanggal Pesanan</th>
                    <th>Nama Pemesan</th>
                    <th>Paket</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                    {preorders.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.order_date}</td>
                            <td>{item.order_by}</td>
                            <td>{item.selected_package}</td>
                            <td>{item.qty}</td>
                            <td>{item.status}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                    {preorders.length === 0 && (
                        <tr>
                            <td colSpan="7">Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}


