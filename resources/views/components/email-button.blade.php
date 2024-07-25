@php
    $styles = join('; ', [
        'background-color: rgb(56,132,247)',
        'padding: 0px 10px',
        'width: fit-content',
        'min-width: 100px',
        'height: 40px',
        'font-weight: bold',
        'font-size: large',
        'color: #fff',
        'outline: none',
        'border: none',
        'border-radius: 5px',
        'cursor: pointer',
    ]);
@endphp

<a target="_blank" href="{{ $actionUrl }}">
    <button type="button" style="{{ $styles }}">
        {{ $text }}
    </button>
</a>
