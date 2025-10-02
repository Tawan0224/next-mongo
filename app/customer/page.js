"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";

export default function CustomerPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  
  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const columns = [
    { field: 'memberNumber', headerName: 'Member #', width: 120 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'address', headerName: 'Address', width: 200 },
    { 
      field: 'dateOfBirth', 
      headerName: 'Date of Birth', 
      width: 120,
      valueFormatter: (params) => {
        if (!params) return '';
        return new Date(params).toLocaleDateString();
      }
    },
    {
      field: 'interests',
      headerName: 'Interests',
      width: 200,
      valueFormatter: (params) => {
        if (!params || params.length === 0) return '';
        return params.join(', ');
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link
            href={`/customer/${params.row._id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            View
          </Link>
          <button 
            onClick={() => startEditMode(params.row)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteCustomer(params.row)} 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  async function fetchCustomers() {
    const response = await fetch(`${API_BASE}/customer`);
    const data = await response.json();
    const customersWithId = data.map(customer => ({
      ...customer,
      id: customer._id
    }));
    setCustomerList(customersWithId);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleCustomerFormSubmit(data) {
    // Convert comma-separated interests to array
    if (typeof data.interests === 'string') {
      data.interests = data.interests.split(',').map(i => i.trim()).filter(i => i);
    }
    
    const method = editMode ? "PUT" : "POST";
    
    try {
      await fetch(`${API_BASE}/customer`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (editMode) stopEditMode();
      reset();
      fetchCustomers();
    } catch (error) {
      alert("Error saving customer: " + error.message);
    }
  }

  function startEditMode(customer) {
    // Convert interests array back to comma-separated string for editing
    const editData = {
      ...customer,
      interests: Array.isArray(customer.interests) ? customer.interests.join(', ') : '',
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : ''
    };
    reset(editData);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      memberNumber: '',
      dateOfBirth: '',
      interests: ''
    });
    setEditMode(false);
  }

  async function deleteCustomer(customer) {
    if (!confirm(`Delete ${customer.name}?`)) return;
    
    await fetch(`${API_BASE}/customer/${customer._id}`, {
      method: "DELETE"
    });
    fetchCustomers();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>
      
      <form onSubmit={handleSubmit(handleCustomerFormSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4 max-w-3xl border border-gray-300 p-6 rounded-lg bg-white shadow">
          
          <div className="font-semibold">Member Number:</div>
          <input
            {...register("memberNumber", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
            placeholder="e.g., M001"
          />
          
          <div className="font-semibold">Name:</div>
          <input
            {...register("name", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
            placeholder="Full name"
          />
          
          <div className="font-semibold">Email:</div>
          <input
            type="email"
            {...register("email", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
            placeholder="email@example.com"
          />
          
          <div className="font-semibold">Phone:</div>
          <input
            {...register("phone", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
            placeholder="Phone number"
          />
          
          <div className="font-semibold">Date of Birth:</div>
          <input
            type="date"
            {...register("dateOfBirth", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
          />
          
          <div className="font-semibold">Address:</div>
          <textarea
            {...register("address", { required: true })}
            className="border border-gray-400 rounded px-3 py-2"
            rows="2"
            placeholder="Full address"
          />
          
          <div className="font-semibold">Interests:</div>
          <input
            {...register("interests")}
            className="border border-gray-400 rounded px-3 py-2"
            placeholder="e.g., Sports, Music, Reading (comma-separated)"
          />
          
          <div className="col-span-2 text-right mt-4">
            {editMode ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Update Customer
                </button>
                <button
                  type="button"
                  onClick={stopEditMode}
                  className="ml-3 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Add Customer
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Customer List ({customerList.length})</h2>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={customerList}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>
      </div>
    </main>
  );
}