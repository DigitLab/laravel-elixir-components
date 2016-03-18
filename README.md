# laravel-elixir-components

This is a simple web component for Laravel Elixir.

## Install

```
npm install --save-dev laravel-elixir-components
```

## Usage

### Example *Gulpfile*:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-components');

elixir(function(mix) {
   mix.components('**/*.html');
});
```

This will scan your `resources/assets/components` directory for html files. Please see the `examples` directory for
a component example.

#### Defining `elixir.config.components` in your *Gulpfile*

You can define `elixir.config.components` in your `gulpfile.js` like so:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-components');

elixir.config.components = {
    folder: 'components',
    buildFolder: 'components'
};

elixir(function(mix) {
   mix.components('**/*.html');
});
```

#### Setting `config.components` in an `elixir.json` file

You can create an [`elixir.json`](https://github.com/laravel/elixir/blob/dfd6655537eb3294a4c71e826cd0e8a6f6b2108b/index.js#L50-L67)
file in your project root to modify Elixir's default settings.

```json
{
    "components": {
        "folder": "components",
        "buildFolder": "components"
    }
}
```

## License

laravel-elixir-components is licensed under The MIT License (MIT).