"use client"
import React from 'react';
import './Table.css'; // 导入样式文件

const Table = () => {
  const tableData = [
    { id: 1, col1: 'Row 1', col2: 'Data 1', col3: 'Data 2' },
    { id: 2, col1: 'Row 2', col2: 'Data 3', col3: 'Data 4' },
    // Add more rows as needed
  ];

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>First Column</th>
            <th>Second Column</th>
            <th>Third Column</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td className="fixed-column">{row.col1}</td>
              <td className="slideable">{row.col2}</td>
              <td className="slideable">{row.col3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
