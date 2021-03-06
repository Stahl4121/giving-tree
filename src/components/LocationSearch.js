import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import Geocode from "react-geocode";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function LocationSearch(props) {
  const k1 = 'AIzaSyAjz9nJV';
  const k2 = 'KiBKdpCHh9x0';
  const k3 = 'EuvGbdhD90lmdM';
  const gck = k1+k2+k3;
  Geocode.setApiKey(gck);
  const [inputValue, setInputValue] = React.useState("");
  const [locationVal, setLocationVal] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);
  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA8f5dVQik-rPn3dyWa4-jS-A7tnZj5p5Y&libraries=places",
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const handleKeyPress = (event) => {
    setInputValue(event.target.value);
  }

  const handleChange = (event, value) => {
    setLocationVal(value);
    if (value && typeof value !== 'undefined' && value.description.trim() !== '') {
      Geocode.fromAddress(value.description).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          props.parentCallback({address: value, lat: lat, long: lng});
        },
        error => {
          props.parentCallback({address: '', lat: 0, long: 0});
          console.error("Error: Location could not be found.", error);
        }
      );
    }
    else{
      props.parentCallback({address: '', lat: 0, long: 0});
    }

  };

  const fetch = React.useMemo(
    () =>
      throttle((input, callback) => {
        autocompleteService.current.getPlacePredictions(input, callback);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    fetch({ input: inputValue }, results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      id="loc-bar"
      getOptionLabel={option =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={x => x}
      options={options}
      autoComplete
      fullWidth
      includeInputInList
      disableOpenOnFocus
      value={(props.clearLocationVal) ? '' : locationVal}
      defaultValue={props.address}
      onChange={handleChange}
      renderInput={params => (
        <TextField
          name="loc-textfield"
          id="loc-textfield"
          error={props.error}
          {...params}
          label="Search from a location"
          onChange={handleKeyPress}
          fullWidth
        />
      )}
      renderOption={option => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map(match => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item xs={12}>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
