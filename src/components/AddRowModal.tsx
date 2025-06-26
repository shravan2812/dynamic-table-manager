'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addRow } from '../store/slices/tableSlice';
import { v4 as uuidv4 } from 'uuid';

const AddRowModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    role: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.age || !form.role) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(addRow({ ...form, id: uuidv4(), age: Number(form.age) }));
    setForm({ name: '', email: '', age: '', role: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Row</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={handleChange('name')} />
          <TextField label="Email" value={form.email} onChange={handleChange('email')} />
          <TextField label="Age" type="number" value={form.age} onChange={handleChange('age')} />
          <TextField label="Role" value={form.role} onChange={handleChange('role')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add Row
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRowModal;
