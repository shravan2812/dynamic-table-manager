"use client";

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
    importCsvData,
    updateRow,
    deleteRow,
    TableRow,
} from '../store/slices/tableSlice';
import {
    DataGrid,
    GridColDef,
    GridRowModesModel,
    GridRowModes,
    GridRowId,
    GridActionsCellItem,
} from '@mui/x-data-grid';
import {
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';
import ColumnManagerModal from './ColumnManagerModal';
import * as Papa from 'papaparse';
import { exportToCSV } from '../utils/csv';
import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';
import AddRowModal from './AddRowModal';



const DataTable = () => {
    const dispatch = useDispatch();
    const rows = useSelector((state: RootState) => state.table.rows);
    const visibleColumns = useSelector((state: RootState) => state.table.visibleColumns);

    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const { mode, toggleTheme } = useContext(ThemeContext);
    const [openAddRow, setOpenAddRow] = useState(false);



    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const validData = results.data.filter((row: any) =>
                    row.name && row.email && row.age && row.role
                );
                if (validData.length === 0) {
                    alert('CSV format invalid or empty!');
                    return;
                }
                dispatch(importCsvData(validData));
            },
        });

        e.target.value = '';
    };

    const handleSaveClick = (id: GridRowId) => {
        setRowModesModel((prev) => ({
            ...prev,
            [String(id)]: { mode: GridRowModes.View },
        }));
    };

    const handleDeleteClick = (id: GridRowId) => {
        dispatch(deleteRow(String(id)));
    };

    const processRowUpdate = (updatedRow: TableRow) => {
        dispatch(updateRow(updatedRow));
        return updatedRow;
    };

    const allColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200, editable: true },
        { field: 'email', headerName: 'Email', width: 250, editable: true },
        { field: 'age', headerName: 'Age', width: 100, type: 'number', editable: true },
        { field: 'role', headerName: 'Role', width: 200, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 140,
            getActions: (params) => [
                <GridActionsCellItem
                    key="save"
                    icon={<span style={{ color: 'green' }}>💾</span>}
                    label="Save"
                    onClick={() => handleSaveClick(params.id)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<span style={{ color: 'red' }}>🗑</span>}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.id)}
                    showInMenu
                />,
            ],
        },
    ];

    const filteredColumns = useMemo(() => {
        return allColumns.filter(
            (col) => col.field === 'actions' || visibleColumns.includes(col.field)
        );
    }, [visibleColumns]);

    const filteredRows = useMemo(() => {
        const searchLower = searchText.toLowerCase();
        return rows.filter((row) =>
            row.name.toLowerCase().includes(searchLower) ||
            row.email.toLowerCase().includes(searchLower) ||
            row.age.toString().includes(searchLower) ||
            row.role.toLowerCase().includes(searchLower)
        );
    }, [rows, searchText]);

    return (
        <Box sx={{ height: 600, width: '100%', padding: '1rem' }}>
            <Typography variant="h5" align="center" gutterBottom>
                📊 Dynamic Data Table
            </Typography>

            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name, email, age or role..."
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Button variant="outlined" onClick={() => setOpenModal(true)}>
                    Manage Columns
                </Button>

                <label htmlFor="csv-upload">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="csv-upload"
                    />
                    <Button variant="outlined" component="span">
                        Import CSV
                    </Button>
                </label>

                <Button
                    variant="outlined"
                    color="success"
                    onClick={() => exportToCSV('table-data', filteredRows, visibleColumns)}
                >
                    Export CSV
                </Button>
                <Button variant="outlined" onClick={toggleTheme}>
                    Toggle {mode === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
                </Button>
                <Button variant="outlined" onClick={() => setOpenAddRow(true)}>
                    + Add Row
                </Button>

            </Box>

            <DataGrid
                rows={filteredRows}
                columns={filteredColumns}
                pageSizeOptions={[10]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={(model) => setRowModesModel(model)}
                processRowUpdate={processRowUpdate}
            />

            <ColumnManagerModal open={openModal} onClose={() => setOpenModal(false)} />
            <AddRowModal open={openAddRow} onClose={() => setOpenAddRow(false)} />

        </Box>
    );
};

export default DataTable;