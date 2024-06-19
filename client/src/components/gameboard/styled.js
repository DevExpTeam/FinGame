import styled from "styled-components"

export const BVAInputContainer = styled.div`
  .bva-input {
    width: ${props => props.width ? props.width : null};
    
    .MuiInputBase-root input {
      text-align: ${(props) => {
        switch(props.textAlign) {
          case "end":
            return "end"
          case "center":
            return "center"
          default:
            break
        }
      }};
    }
  }
`