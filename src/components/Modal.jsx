import { useState, useEffect } from "react";

function Modal({ open, mode, initialData, onSubmit, onClose }) {
	const [id, setId] = useState(null);
	const [NIM, setNIM] = useState("");
	const [NamaLengkap, setNamaLengkap] = useState("");
	const [TanggalLahir, setTanggalLahir] = useState("");

	useEffect(() => {
		if (initialData) {
			setId(initialData.id);
			setNIM(initialData.NIM);
			setNamaLengkap(initialData.NamaLengkap);
			setTanggalLahir(initialData.TanggalLahir);
		} else {
			setId(null);
			setNIM("");
			setNamaLengkap("");
			setTanggalLahir("");
		}
	}, [initialData, open]);

	const handleSubmit = () => {
		onSubmit(id, {
			NIM,
			NamaLengkap,
			TanggalLahir
		});
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center rounded-xl">
			<div className="bg-white p-6 shadow w-80 rounded-xl">
				<h2 className="font-bold text-2xl mb-6">
					{mode === "edit" ? "Edit Item" : "Create Item"}
				</h2>

				<div className="space-y-4">
					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							NIM
						</label>
						<input
						value={NIM}
						onChange={(e) => setNIM(e.target.value)}
						className="
								border border-gray-300 rounded-lg p-2 w-full 
								hover:border-gray-400 
								focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
								transition
							"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Nama Lengkap
						</label>
						<input
						value={NamaLengkap}
						onChange={(e) => setNamaLengkap(e.target.value)}
						className="
								border border-gray-300 rounded-lg p-2 w-full 
								hover:border-gray-400 
								focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
								transition
							"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Tanggal Lahir
						</label>
						<input
						type="date"
						value={TanggalLahir}
						onChange={(e) => setTanggalLahir(e.target.value)}
						className="
								border border-gray-300 rounded-lg p-2 w-full 
								hover:border-gray-400 
								focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
								transition
							"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-6">
					<button
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
						onClick={handleSubmit}
					>
						{mode === "edit" ? "Update" : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Modal;
