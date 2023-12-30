<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public $collection = [];
    public $headers = [];

    public function __construct($collection = [], $headers = [])
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
}
