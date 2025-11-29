import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';

function Dashboard() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editData, setEditData] = useState(null);
	
	const handleApiError = async (response) => {
		const err = await response.json();

		if (err.error === "VALIDATION_ERROR") {
			const msg = Object.entries(err.fields)
				.map(([field, message]) => `${field}: ${message}`)
				.join("<br>");

			console.log("tes")
			Swal.fire({
				icon: "error",
				title: "Validation Error",
				html: msg
			});
			return;
		}

		Swal.fire({
			icon: "error",
			title: "Error",
			text: err.error ?? "Unexpected error"
		});
	};

	const fetchStudents = () => {
		setLoading(true);
		fetch('http://localhost:8080/students')
			.then(res => {
				if (!res.ok) throw new Error("Failed to fetch");
				return res.json();
			})
			.then(json => {
				setData(json);
				setLoading(false);
			})
			.catch(err => {
				console.error(err);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	const handleAdd = () => {
		setIsModalOpen(true);
		setEditData(null);
	}

	const handleEdit = (data) => {
		setIsModalOpen(true);
		setEditData(data);
	}

	const handleSubmit = async (id, data) => {
		const isEdit = !!id;

		const url = isEdit
			? `http://localhost:8080/students/${id}`
			: `http://localhost:8080/students`;

		const message = isEdit
			? "Data Berhasil diubah"
			: "Data Berhasil dibuat";

		const method = isEdit ? "PUT" : "POST";

		try {
			const res = await fetch(url, {
				method: method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				await handleApiError(res);
				throw new Error("Request failed");
			}

			const result = await res.json();
			fetchStudents();

			return result;

		} catch (err) {
			throw err;
		}
	};



	const handleDelete = async (id) => {
		const confirm = await Swal.fire({
			title: "Yakin ingin menghapus?",
			text: "Data akan hilang permanen",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Hapus"
		});

		if (!confirm.isConfirmed) return;

		const res = await fetch(`http://localhost:8080/students/${id}`, { method: "DELETE" });

		if (!res.ok) {
			await handleApiError(res);
			return;
		}

		Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
		fetchStudents();
	};

	if (loading) return <p>Loading...</p>;

  return (
	<div className='w-full p-8 flex flex flex-col justify-center'>
		<h1 className='text-center font-bold text-3xl mb-5'>Data Mahasiswa</h1>
		<div>
			<button 
				onClick={handleAdd} 
				className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				Add Item
			</button>
		</div>

		<div className="overflow-x-auto w-full">
			<table className="w-full border border-gray-300 bg-white shadow rounded-lg border-collapse">
			<thead className="bg-gray-200">
				<tr>
				<th className="min-w-32 px-4 py-2 text-center border">NIM</th>
				<th className="min-w-64 px-4 py-2 text-center border">Nama Lengkap</th>
				<th className="min-w-32 px-4 py-2 text-center border">Tanggal Lahir</th>
				<th className="px-4 py-2 text-center border">Action</th>
				</tr>
			</thead>
			<tbody>
				{data.map(item => (
				<tr key={item.id} className="hover:bg-gray-50">
					<td className="px-4 py-2 border text-center">{item.NIM}</td>
					<td className="px-4 py-2 border text-center">{item.NamaLengkap}</td>
					<td className="px-4 py-2 border text-center">{item.TanggalLahir}</td>
					<td className="px-4 py-2 border items-center">
						<div className='w-full flex justify-center gap-4'>
							<button 
								onClick={() => handleEdit(item)} 
								className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
							>
								Edit
							</button>
							<button 
								onClick={() => handleDelete(item.id)} 
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
							>
								Delete
							</button>
						</div>
					</td>
				</tr>
				))}
			</tbody>
			</table>
		</div>

		<Modal
			open={isModalOpen}
			mode={editData ? "edit" : "create"}
			initialData={editData}
			onSubmit={handleSubmit}
			onClose={() => setIsModalOpen(false)}
		/>
	</div>
  );
}

export default Dashboard;
