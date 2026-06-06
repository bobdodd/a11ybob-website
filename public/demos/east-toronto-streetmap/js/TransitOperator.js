class TransitOperator {

    static operators = [];

    constructor(operator) {
        this.operator = operator;
        TransitOperator.operators[operator] = this;
    }

};
