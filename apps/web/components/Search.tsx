import React from 'react'

export function Search(props) {
  return (
    <input
      ref={props.inputRef}
      className="searchInput"
      value={props.inputValue}
      onChange={props.handleInputChange}
      autoComplete="off"
      role="combobox"
      aria-autocomplete="list"
      aria-controls="search-suggestions"
      aria-expanded={props.suggestionsAreVisible}
      id="places-search-autocomplete"
    />
  )
}
