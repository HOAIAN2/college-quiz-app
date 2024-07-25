<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class EmailButton extends Component
{
	/**
	 * Create a new component instance.
	 */
	public function __construct(
		public string $text,
		public string $actionUrl
	) {
	}

	/**
	 * Get the view / contents that represent the component.
	 */
	public function render(): View|Closure|string
	{
		return view('components.email-button');
	}
}
