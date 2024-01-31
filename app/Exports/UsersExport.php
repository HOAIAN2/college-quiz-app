<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Str;

class UsersExport implements
	FromCollection,
	WithHeadings,
	ShouldAutoSize,
	WithStyles,
	WithMapping
{
	/**
	 * @return Collection
	 */
	public $collection = [];
	public $headers = [];
	public $columns = [];

	public function __construct(Collection $collection, $columns = [])
	{
		$headers = array_map(function ($value) {
			if (Str::contains($value, '.')) {
				[$model, $fieldName] = explode('.', $value);
				return trans("headers.$model.$fieldName");
			} else return trans("headers.users.$value");
		}, $columns);

		$this->collection = $collection;
		$this->headers = $headers;
		$this->columns = $columns;
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
	public function map($user): array
	{
		$data = array_map(function ($column) use ($user) {
			if (Str::contains($column, '.')) {
				[$relation, $relationColumn] = explode('.', $column);
				if ($user->relationLoaded($relation))
					return $user->{$relation}->{$relationColumn};
				return null;
			}
			return $user->{$column};
		}, $this->columns);
		return $data;
	}
}
