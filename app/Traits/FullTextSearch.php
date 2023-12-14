<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait FullTextSearch
{
    /**
     * Replaces spaces with full text search wildcards
     *
     * @param string $term
     * @return string
     */
    protected function fullTextWildcards($term)
    {
        // removing symbols used by MySQL
        $reservedSymbols = ['-', '+', '<', '>', '@', '(', ')', '~'];

        $term = str_replace($reservedSymbols, '', $term);

        $words = explode(' ', $term);

        foreach ($words as $key => $word) {
            if (strlen($word) >= 3) {
                $words[$key] = "{$word}*";
            }
        }

        return implode(' ', $words);
    }

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
        // $columns = collect($this->searchable)->map(function ($column) {
        //     return $this->qualifyColumn($column);
        // })->implode(',');
        if (in_array('first_name', $columns) && in_array('last_name', $columns)) {
            $query->where(DB::raw("CONCAT (last_name, ' ' , first_name)"), 'like', '%' . $term . '%')
                ->orWhere(DB::raw("CONCAT (first_name, ' ' , last_name)"), 'like', '%' . $term . '%');
        }
        foreach ($columns as $column) {
            $query->orWhere($column, 'like', '%' . $term . '%');
        }
        // $query->whereRaw("MATCH ({$columns}) AGAINST (? IN BOOLEAN MODE)", $this->fullTextWildcards($term));
        return $query;
    }
}
