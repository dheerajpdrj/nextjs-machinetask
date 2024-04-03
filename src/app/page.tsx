"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTableData, setTableData } from "@/redux/slices/tabledataslice";
import Modal from "@/components/Modal";
import ConfirmationModal from "@/components/ConfirmationModal";

export const tableHeadings = [
  "Name",
  "Email",
  "Phone",
  "Date Of Birth",
  "Gender",
  "Edit",
  "Delete",
];

type FormData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
};

const Home = () => {
  const tableData = useSelector((state: any) => state.tableData.tabledata);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<FormData | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const addData = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (formData: FormData) => {
    if (editData) {
      const updatedData = { ...editData, ...formData };
      dispatch(setTableData(updatedData));
      setIsModalOpen(false);
      setEditData(null);
    } else {
      const id = Math.floor(Math.random() * 1000000);
      const data = { ...formData, id };
      dispatch(setTableData(data));
      setIsModalOpen(false);
    }
  };

  const openEditModal = (data: FormData) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteItemId) {
      dispatch(deleteTableData(deleteItemId));
      setDeleteItemId(null);
      setIsConfirmationModalOpen(false);
    }
  };
  return (
    <main className="mt-3 flex flex-col lg:justify-center lg:items-center">
      <div>
        <button
          onClick={addData}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Data
        </button>
      </div>
      <div>
        <table className="table-auto border-collapse border border-blue-500">
          <thead>
            <tr>
              {tableHeadings.map((heading, index) => (
                <th key={index} className="border border-blue-500 px-4 py-2">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-blue-500 px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              tableData.map((data: FormData, index: number) => (
                <tr key={index} className="border border-blue-500 px-4 py-2">
                  <td className="p-1">{data.name}</td>
                  <td className="p-1">{data.email}</td>
                  <td className="p-1">{data.phone}</td>
                  <td className="p-1">{data.dob}</td>
                  <td className="p-1">{data.gender}</td>
                  <td className="p-1">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => openEditModal(data)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-1">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelete(data.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          data={editData}
        />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this item?"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
    </main>
  );
};

export default Home;
