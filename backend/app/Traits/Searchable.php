<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

trait Searchable
{
    /**
     * Scope a query that search in model and relation.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $value
     * @param array $columns = []
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $value, array $columns = [])
    {
        $search_against = "$value%";
        if (empty($columns)) $columns = $this->searchable;
        if (in_array('first_name', $columns) && in_array('last_name', $columns)) {
            $query->where(DB::raw("CONCAT (last_name, ' ' , first_name)"), 'like', $search_against)
                ->orWhere(DB::raw("CONCAT (first_name, ' ' , last_name)"), 'like', $search_against);
        }

        $first_column = array_shift($columns);
        if (Str::contains($first_column, '.')) {
            [$relation, $relationColumn] = explode('.', $first_column);
            $query->whereHas($relation, function ($subQuery) use ($search_against, $relationColumn) {
                $subQuery->where($relationColumn, 'like', $search_against);
            });
        } else $query->where($first_column, 'like', $search_against);

        foreach ($columns as $column) {
            if (Str::contains($column, '.')) {
                [$relation, $relationColumn] = explode('.', $column);
                $query->orWhereHas($relation, function ($subQuery) use ($search_against, $relationColumn) {
                    $subQuery->where($relationColumn, 'like', $search_against);
                });
            } else $query->orWhere($column, 'like', $search_against);
        }
        return $query;
    }
}
