import { useState } from "react";
import babyNamesData from "../babyNamesData.json";

interface BabyNameProp {
  name: string;
  id: number;
  sex: string;
}

interface FilterButtonProp {
  name: string;
  regexp: string;
  active: boolean;
}

function babyNamecompareFunction(a: BabyNameProp, b: BabyNameProp): number {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else {
    return 0;
  }
}

export default function BabyNames(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("");
  const [favourites, setFavourites] = useState<BabyNameProp[]>([]);
  const [activeButton, setActiveButton] = useState<FilterButtonProp>({
    name: "🤠 or 👧",
    regexp: "m|f",
    active: true,
  });

  function babyNameFilter(
    babyNameObject: BabyNameProp,
    inputText: string
  ): boolean {
    const searchRegex = new RegExp(inputText);
    return (
      searchRegex.test(babyNameObject.name) &&
      !isFavourite(babyNameObject) &&
      RegExp(activeButton.regexp).test(babyNameObject.sex)
    );
  }

  function isFavourite(babyNameObject: BabyNameProp): boolean {
    return favourites.filter((f) => f.id === babyNameObject.id).length > 0;
  }

  function onChangeHandler(inputText: string) {
    setInputValue(inputText);
  }

  function babyNameOnClickHandler(babyNameObject: BabyNameProp) {
    setFavourites((previousValue) => [...previousValue, babyNameObject]);
    console.log(babyNameObject.name);
  }

  function favouriteOnClickHandler(babyNameObject: BabyNameProp) {
    setFavourites((prevValue) =>
      prevValue.filter((f) => !(f.id === babyNameObject.id))
    );
  }

  function FilterButton({
    name,
    regexp,
    active,
  }: FilterButtonProp): JSX.Element {
    const buttonObject: FilterButtonProp = {
      name: name,
      regexp: regexp,
      active: active,
    };
    return (
      <button
        className={"filter-button-active-" + String(activeButton.name === name)}
        onClick={() => setActiveButton(buttonObject)}
      >
        {name}
      </button>
    );
  }

  return (
    <>
      <div className="search-div">
        <div className="filter-buttons-div">
          <input
            placeholder="Search for a baby name..."
            value={inputValue}
            onChange={(e) => onChangeHandler(e.target.value)}
          ></input>
          <FilterButton
            name={"🤠 or 👧"}
            regexp={"m|f"}
            active={activeButton.name === "🤠 or 👧"}
          />
          <FilterButton
            name={"🤠"}
            regexp={"m"}
            active={activeButton.name === "🤠"}
          />
          <FilterButton
            name={"👧"}
            regexp={"f"}
            active={activeButton.name === "👧"}
          />
        </div>

        <p>
          Favourites:
          {favourites.map((f: BabyNameProp) => (
            <span
              onClick={() => favouriteOnClickHandler(f)}
              className={f.sex}
              key={f.id}
            >
              {f.name}
            </span>
          ))}
        </p>
        <hr></hr>
      </div>
      <div className="name-div">
        {babyNamesData
          .filter((element) => babyNameFilter(element, inputValue))
          .sort(babyNamecompareFunction)
          .map((x: BabyNameProp) => (
            <span
              onClick={() => babyNameOnClickHandler(x)}
              key={x.id}
              className={x.sex}
            >
              {x.name}
            </span>
          ))}
      </div>
    </>
  );
}
