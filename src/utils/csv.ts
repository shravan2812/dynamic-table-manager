import { saveAs } from 'file-saver';

export function exportToCSV(filename: string, data: any[], visibleColumns: string[]) {
  if (data.length === 0) return;

  const header = visibleColumns;
  const csvRows = [
    header.join(','), // CSV header
    ...data.map(row =>
      visibleColumns.map(field =>
        `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`
      ).join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}
