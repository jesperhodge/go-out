import React from 'react'

export function Search(props: any) {
  return (
    <>
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
      {props.suggestionsAreVisible && (
        <ul className="suggestions" id="search-suggestions" role="listbox" aria-label="Suggested locations:">
          {props.suggestions.map((suggestion: any) => (
            <li key={suggestion.id} onClick={() => props.selectSuggestion(suggestion)} id={suggestion.id}>
              <span>{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
