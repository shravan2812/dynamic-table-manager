'use client';

import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setVisibleColumns } from '../store/slices/tableSlice';

const allColumnFields = [
  { field: 'name', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'age', label: 'Age' },
  { field: 'role', label: 'Role' },
];

interface ColumnManagerModalProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManagerModal: React.FC<ColumnManagerModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const visibleColumns = useSelector((state: RootState) => state.table.visibleColumns);
  const [tempSelection, setTempSelection] = React.useState<string[]>(visibleColumns);

  const handleCheckboxChange = (field: string) => {
    if (tempSelection.includes(field)) {
      setTempSelection(tempSelection.filter(f => f !== field));
    } else {
      setTempSelection([...tempSelection, field]);
    }
  };

  const handleSave = () => {
    dispatch(setVisibleColumns(tempSelection));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {allColumnFields.map(col => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={tempSelection.includes(col.field)}
                  onChange={() => handleCheckboxChange(col.field)}
                />
              }
              label={col.label}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManagerModal;
