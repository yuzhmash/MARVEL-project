import { Component } from "react";

import Error from "../error/Error";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(e, r) {
        console.log(e, r)
        this.setState({error: true})
    }

    render() {
        if (this.state.error) {
            return <Error/>
        }
        return (
            this.props.children
        )
    }
}

export default ErrorBoundary;