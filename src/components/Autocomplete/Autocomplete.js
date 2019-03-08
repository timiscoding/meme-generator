import React, { useEffect, useReducer, useRef } from "react";
import styled from "react-emotion";
import { css } from "emotion";
import withProps from "recompose/withProps";

import Icon from "../Icon";

const Container = styled.div`
  position: relative;
`;

const Search = styled.div`
  border: 1px solid grey;
  display: inline-flex;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  width: 30px;
  padding: 0;
  cursor: pointer;
`;

const SearchInput = withProps({
  type: "text",
  autoComplete: "off"
})(styled.input`
  border: none;
  padding: 5px;
`);

const searchIconStyle = css`
  padding: 5px;
  fill: lightgrey;
  transition: all 0.2s;
  ${Button}:hover & {
    background-color: lightgrey;
    fill: grey;
  }
  ${Button}:active & {
    transition: none;
    background-color: grey;
    fill: lightgreen;
  }
`;

const clearIconStyle = css`
  padding: 5px;
  fill: lightgrey;
  ${Button}:hover & {
    fill: grey;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  border: 1px solid grey;
  position: absolute;
  margin: 0;
`;

const ListItem = styled.li`
  background-color: ${({ active }) => (active ? "lightblue" : "white")};
  user-select: none;
  padding: 5px 10px;
`;

const OptionList = ({
  options,
  active,
  onClick,
  onMouseOver,
  onMouseLeave
}) => {
  return (
    <List tabIndex={-1} onMouseLeave={onMouseLeave}>
      {options.map((option, index) => (
        <ListItem
          active={active === index}
          data-option={index}
          onClick={onClick}
          onMouseOver={onMouseOver}
        >
          {option}
        </ListItem>
      ))}
    </List>
  );
};

const Autocomplete = ({ onSearch = () => {}, options = [] }) => {
  const inputEl = useRef(null);
  const autoCompleteEl = useRef(null);
  const initialState = {
    search: "",
    value: "",
    active: -1,
    filtered: [],
    showOptions: false
  };
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "reset":
        return { ...initialState };
      case "filterOptions":
        const { input } = action;
        const filtered = options.filter(
          el => el.toLowerCase().indexOf(input.toLowerCase()) !== -1
        );
        return {
          search: input,
          value: input,
          filtered,
          showOptions: filtered.length > 0,
          active: -1
        };
      case "setOption":
        return {
          filtered: [],
          search: action.search,
          value: action.search,
          active: -1,
          showOptions: false
        };
      case "nextOption": {
        const active =
          state.active + 1 < state.filtered.length ? state.active + 1 : -1;
        return state.filtered.length > 0
          ? {
              ...state,
              showOptions: true,
              active,
              value: active > -1 ? state.filtered[active] : state.search
            }
          : state;
      }
      case "prevOption": {
        if (state.filtered.length === 0) return state;
        const active =
          state.active > -1 ? state.active - 1 : state.filtered.length - 1;
        return {
          ...state,
          showOptions: true,
          active,
          value: active > -1 ? state.filtered[active] : state.search
        };
      }
      case "hideOptions":
        return {
          ...state,
          showOptions: false,
          active: -1
        };
      case "activeOption":
        return {
          ...state,
          active: action.active
        };
      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { value, active, filtered, showOptions } = state;
  useEffect(
    () => {
      if (!value || value.length === 0) return;
      const caret = value.length;
      inputEl.current.selectionStart = caret;
      inputEl.current.selectionEnd = caret;
    },
    [value]
  );
  const handleChange = e => {
    const input = e.target.value;
    if (input) {
      dispatch({ type: "filterOptions", input });
    } else {
      dispatch({ type: "reset" });
    }
  };
  const handleBlur = e => {
    const childFocused = autoCompleteEl.current.contains(e.relatedTarget);
    if (!childFocused) {
      dispatch({ type: "hideOptions" });
    }
  };
  const handleClick = e => {
    inputEl.current.focus();
    dispatch({ type: "setOption", search: filtered[e.target.dataset.option] });
  };
  const handleMouseOver = e => {
    dispatch({
      type: "activeOption",
      active: parseInt(e.target.dataset.option, 10)
    });
  };
  const handleMouseLeave = e => {
    dispatch({ type: "activeOption", active: -1 });
  };
  const handleSearch = () => {
    console.log("search for", value);
    value && onSearch(value);
  };
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      if (active !== -1) {
        dispatch({
          type: "setOption",
          search: filtered[active]
        });
      }
      handleSearch();
    }
    if (e.key === "ArrowDown") {
      dispatch({ type: "nextOption" });
    }
    if (e.key === "ArrowUp") {
      dispatch({ type: "prevOption" });
    }
    if (e.key === "Escape") {
      dispatch({ type: "hideOptions" });
    }
  };
  const handleClear = () => {
    dispatch({ type: "reset" });
  };
  return (
    <Container onBlur={handleBlur} innerRef={autoCompleteEl}>
      <Search>
        <SearchInput
          name="search"
          placeholder="Search..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          innerRef={inputEl}
        />
        {value && (
          <Button onClick={handleClear}>
            <Icon name="clear" customCss={clearIconStyle} />
          </Button>
        )}
        <Button onClick={handleSearch}>
          <Icon name="search" customCss={searchIconStyle} />
        </Button>
      </Search>
      {showOptions && (
        <OptionList
          options={filtered}
          active={active}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </Container>
  );
};

export default Autocomplete;
