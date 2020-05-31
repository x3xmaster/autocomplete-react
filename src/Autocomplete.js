import React, {Component} from "react";


export default class Autocomplete extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeOptions: 0,
            filteredOptions: [],
            showOptions: false,
            userInput: "",
            data: []
        }
    }

    renderSwitch(param) {
        switch(param) {
            case "getCountries" :
                return "https://restcountries.eu/rest/v2/all";
            default :
              return ""
        }
    }

     async componentDidMount(){
        await fetch( this.renderSwitch(this.props.options) )
        .then( response => response.json() )
        .then( data => this.setState({data: [...data]}) )
    }

    onChange = e => {
        const userInput = e.currentTarget.value;
        const filteredOptions = this.state.data.filter( optionName => optionName["name"].toLowerCase().indexOf(userInput) > -1 )

        this.setState({
            filteredOptions,
            showOptions: true,
            userInput: e.currentTarget.value
        });
    }

    onClick = e => {
        this.setState({
            filteredOptions: [],
            showOptions: false,
            userInput: e.currentTarget.innerText
        })
    }

    onKeyDown = e => {
        const { activeOptions, filteredOptions } = this.state;

        if(e.key === "Enter" && filteredOptions.length > 1) {
            this.setState({showOptions: false, userInput: filteredOptions[activeOptions]["name"]});
        } else if (e.key === "ArrowUp" && filteredOptions.length > 1) {
            if (activeOptions === 0) return;
            this.setState({activeOptions: activeOptions -1})
        } else if (e.key === "ArrowDown" && filteredOptions.length > 1) {
            if(activeOptions === filteredOptions.length - 1) return;
            this.setState({activeOptions: activeOptions +1});
        }
    }

    render(){
        const {
            onChange,
            onKeyDown,
            onClick,
            state: {activeOptions, filteredOptions, showOptions, userInput}} = this;

        let optionList;
        if(showOptions) {
            // if has some in filteredOptions [] and input not empty
            if(filteredOptions.length && userInput.length > 0) {
                optionList = (
                    <ul className="options">
                        {filteredOptions.map((optionName, i) => {
                            let reg = new RegExp(userInput, "gi");
                            optionName = optionName["name"].replace(reg, str => {
                                return `<b>${str}</b>`;
                            });
                            let className = (i === activeOptions) ?  "option-active" : "";
                            return (
                                <li className={className} key={optionName} onClick={onClick}>
                                    <div dangerouslySetInnerHTML={{ __html: optionName }} />
                                </li>
                            )    
                        })}
                    </ul>
                )
            }else{
                optionList = (
                    <div className="no-options">
                        <b>No records</b> 
                    </div>
                )
            }
        }
        
        return (
            <React.Fragment>
                <div className="search">
                    <input type="text" 
                    className="search-box" 
                    onChange={onChange} 
                    onKeyDown={onKeyDown}
                    value={userInput} />
                    {optionList}
                </div>
            </React.Fragment>
        )
    }
}