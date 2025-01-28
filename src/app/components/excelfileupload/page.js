"use client"
import React from "react";
import * as XLSX from "xlsx";

export default function ExcelUpload({ dropdownData, onDataProcessed }) {
    const excelSerialToJSDate = (serial) => {
        const excelEpoch = new Date(1900, 0, 1);
        return new Date(excelEpoch.getTime() + (serial - 2) * 86400000); 
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            const combinedData = data.map((row) => {
                const processedRow = { ...dropdownData, ...row };

                if (processedRow.dateOfInstallation && !isNaN(processedRow.dateOfInstallation)) {
                    processedRow.dateOfInstallation = excelSerialToJSDate(Number(processedRow.dateOfInstallation))
                        .toISOString()
                        .split("T")[0]; 
                }

                return processedRow;
            });

            onDataProcessed(combinedData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <label htmlFor="excelUpload" className="form-label">
                Upload Excel File:
            </label>
            <input
                type="file"
                id="excelUpload"
                className="form-control"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
            />
        </div>
    );
}
