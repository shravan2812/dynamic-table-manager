import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface TableRow {
    id: string;
    name: string;
    email: string;
    age: number;
    role: string;
}

export interface TableState {
    rows: TableRow[];
    visibleColumns: string[]; // 👈 NEW
}

const initialState: TableState = {
    rows: [
        {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            age: 28,
            role: 'Developer',
        },
        {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            age: 35,
            role: 'Manager',
        },
    ],
    visibleColumns: ['name', 'email', 'age', 'role'], // 👈 NEW
};


const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        addRow(state, action: PayloadAction<TableRow>) {
            state.rows.push(action.payload);
        },
        deleteRow(state, action: PayloadAction<string>) {
            state.rows = state.rows.filter(row => row.id !== action.payload);
        },
        updateRow(state, action: PayloadAction<TableRow>) {
            const index = state.rows.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.rows[index] = action.payload;
            }
        },

        // ✅ NEW reducer — Add this below updateRow:
        setVisibleColumns(state, action: PayloadAction<string[]>) {
            state.visibleColumns = action.payload;
        },
        importCsvData(state, action: PayloadAction<any[]>) {
            const newRows = action.payload.map(row => ({
                id: uuidv4(),
                name: row.name,
                email: row.email,
                age: Number(row.age),
                role: row.role,
            }));
            state.rows = [...state.rows, ...newRows];
        }
    },
});


export const { addRow, deleteRow, updateRow, setVisibleColumns,  importCsvData } = tableSlice.actions;
export const tableReducer = tableSlice.reducer;
