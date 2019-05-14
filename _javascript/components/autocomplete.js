import React from 'react';
import Downshift from 'downshift';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
    container: {
      flexGrow: 1
    },
};

class Autocomplete extends React.Component {
    constructor(props) {
        super(props)
    }
    getSuggestions(inputValue, suggestions) {
        let count = 0;
        return suggestions.filter(suggestion => {
          const keep =
            (!inputValue || suggestion.toLowerCase().startsWith(inputValue.toLowerCase())) &&
            count < 3;
          if (keep) {
            count += 1;
          }
          return keep;
        });
    }
    renderSuggestion(params) {
        const { suggestion, index, itemProps, highlightedIndex, selectedItem } = params;
        const isHighlighted = highlightedIndex === index;
        const isSelected = selectedItem === suggestion;
    return (
      <MenuItem
        {...itemProps}
        key={suggestion}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion}
      </MenuItem>
    );
    }
    renderInput(inputProps) {
        const { InputProps, classes, error, onChange, onBlur ,ref, ...other } = inputProps;
        return (
          <TextField
            {...other}
            inputRef={ref}
            fullWidth
            onBlur={onBlur}
            margin="dense"
            error={error}
            onChange={onChange}
            InputProps={{
              classes: {
                input: classes.input,
              },
              ...InputProps,
            }}
          />
        );
    }  
    render() {
        const { placeholder, id, error ,suggestions, classes, label = "", onChange, onBlur } = this.props;
        return (
            <Downshift>
                {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
                <div className={classes.container}>
                    {this.renderInput({
                    fullWidth: true,
                    classes,
                    error,
                    label,
                    onChange,
                    onBlur,
                    InputProps: getInputProps({
                        placeholder,
                        id,
                    }),
                    })}
                    {isOpen ? (
                    <Paper square>
                        {this.getSuggestions(inputValue,suggestions).map((suggestion, index) =>
                        this.renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({ item: suggestion }),
                            highlightedIndex,
                            selectedItem,
                        }),
                        )}
                    </Paper>
                    ) : null}
                </div>
                )}
            </Downshift>
        );
    }
  }
  
export default withStyles(styles)(Autocomplete) 