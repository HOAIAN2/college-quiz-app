<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class UsersExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles
{
    /**
     * @return Collection
     */
    public $collection = [];
    public $headers = [];

    public function __construct(Collection $collection, $headers = [])
    {
        $this->collection = $collection;
        $this->headers = $headers;
    }
    public function collection()
    {
        return $this->collection;
    }
    public function headings(): array
    {
        return $this->headers;
    }
    public function styles(Worksheet $sheet)
    {
        // Get the highest column and row
        $highestColumn = $sheet->getHighestColumn();
        $highestRow = $sheet->getHighestRow();

        // Apply styles to the entire header row
        $sheet->getStyle('1:1')->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],
        ]);

        // Apply styles to all cells in the sheet
        $sheet->getStyle('A1:' . $highestColumn . $highestRow)->applyFromArray([
            'font' => [
                'name' => 'Times New Roman',
                'size' => 12,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
        ]);
    }
}
