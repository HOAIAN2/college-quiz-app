<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public $collection = [];

    public function __construct($collection = [])
    {
        $this->collection = $collection;
    }
    public function collection()
    {
        return $this->collection;
    }
    // public function headings(): array
    // {
    //     $db_column_names = DB::getSchemaBuilder()->getColumnListing((new User())->getTable());
    //     return $db_column_names;
    // }
}
