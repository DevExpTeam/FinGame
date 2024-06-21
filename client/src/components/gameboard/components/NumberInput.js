import React from "react"
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { NumericFormat } from 'react-number-format';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { decimalScale, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.formattedValue,
          },
        });
      }}
      thousandSeparator
      decimalScale={decimalScale}
      valueIsNumericString
    />
  );
});

export default function BVAInput({
  value = 0,
  disabled,
  disabledBold,   //make disabled text bold
  type,
  size = "small",
  adornment = "$",
  decimalScale = 2,
  onChange = () => {}
}) {

  return (
    <TextField
      value={value}
      disabled={disabled}
      type={type}
      size={size}
      onChange={(e) => onChange(e)}
      InputProps={{
        inputComponent: type === "text" ? null : NumericFormatCustom,
        inputProps: { decimalScale },
        startAdornment: <InputAdornment position="start">{adornment}</InputAdornment>
      }}
      sx={{ 
        width: '8.5rem',
        bgcolor: disabled ? "rgb(243 244 246)" : "white",
        mt: 1, zIndex: 0,
        '& .MuiInputBase-input.Mui-disabled': {
          fontWeight: disabledBold && 'bold',
          '-webkit-text-fill-color': 'black',
        },
      }}
    />
  )
}