<?php

namespace App\Traits;

trait Searchable
{
    /**
     * Scope a query to search specifically defined columns.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $term The search keyword
     * @param array $columns The database columns to search (e.g. ['name', 'email'])
     */
    public function scopeSearch($query, $term, $columns = ['name'])
    {
        if (!$term) {
            return $query;
        }
        return $query->where(function ($q) use ($term, $columns) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'like', "%{$term}%");
            }
        });
    }
}