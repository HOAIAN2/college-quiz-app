<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait FullTextSearch
{
    /**
     * Scope a query that matches a full text search of term.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $term)
    {
        $columns = $this->searchable;
        if (in_array('first_name', $columns) && in_array('last_name', $columns)) {
            $query->where(DB::raw("CONCAT (last_name, ' ' , first_name)"), 'like', "%$term%")
                ->orWhere(DB::raw("CONCAT (first_name, ' ' , last_name)"), 'like', "%$term%");
        }
        foreach ($columns as $column) {
            $query->orWhere($column, 'like', "%$term%");
        }
        return $query;
    }
}
