let handleBlur = function(field) {
            return (evt) => {
              this.setState({
                touched: { ...this.state.touched, [field]: true },
              });
            }
          }
let validate = function (rulers) { 
    return function (fields) {
        let errors = Object.keys(fields).map((key) => {
            return ({
                [key]: !rulers[key](fields[key])
            })
        }
        ).reduce((previous, current, indice, vector) => { 
           return Object.assign({}, previous , current)
           }, {})
       return  errors
      }
}

let isDisabled = function (fields, touched) {
    const errors = this.validate(fields);
        function shouldMarkError(field) { 
            const isDisabled = Object.keys(errors).some(x => errors[x]);
            const hasError = errors[field];
            const shouldShow = touched[field];
            return hasError && shouldShow;
        }
        return { isDisabled: Object.keys(errors).some(x => errors[x]), shouldMarkError}
};
let handleChange = function(name) {
            return (e) => {
              this.setState({ form: {...this.state.form, [name]: e.target.value}});
             }
}


export default {handleBlur,validate,isDisabled,handleChange}