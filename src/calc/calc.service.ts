import { HttpException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    //Remove spaces from the expression
    let expression = calcBody.expression.replace(/[\s]/g, '');

    //Operator precedence
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };

    //Numbers array
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    //Check for invalid expressions
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (char in precedence) {
        //Check first and last character should not be operators
        if (i === 0 || i === expression.length - 1) {
          throw new HttpException(
            {
              statusCode: 400,
              message: 'Invalid expression provided',
              error: 'Bad Request',
            },
            400,
          );
        }

        //Check after a operator there should not be a operator again
        if (i > 0 && expression[i - 1] in precedence) {
          throw new HttpException(
            {
              statusCode: 400,
              message: 'Invalid expression provided',
              error: 'Bad Request',
            },
            400,
          );
        }
      } else {
        //Check if the provided expression only has number and not alphabets
        if (!numbers.includes(char)) {
          throw new HttpException(
            {
              statusCode: 400,
              message: 'Invalid expression provided',
              error: 'Bad Request',
            },
            400,
          );
        }
      }
    }

    //Create two stacks for numbers and operators in the expression
    const numArr = [];
    const operators = [];

    let numString = ''; //for numbers greater than 1 digit

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (char >= '0' && char <= '9') {
        numString += char;                                       
      } else {
        if (numString !== '') {
          numArr.push(parseFloat(numString));
          numString = '';
        }

        //Check if char is valid operator in the precedence object
        if (char in precedence) {
          while (
            operators.length > 0 &&
            precedence[operators[operators.length - 1]] >= precedence[char] //only perform loop if the new operator(char) is lower or equal to previous operator
          ) {
            const op = operators.pop();
            const num1 = numArr.pop();
            const num2 = numArr.pop();

            numArr.push(this.performOperation(op, num1, num2));
          }

          operators.push(char);
        } else {
          throw new HttpException(
            {
              statusCode: 400,
              message: 'Invalid expression provided',
              error: 'Bad Request',
            },
            400,
          );
        }
      }
    }

    //For the last remaining char(number) in the string
    if (numString !== '') {
      numArr.push(parseFloat(numString));
    }

    return this.evaluateExpression(numArr, operators);
  }

  //Method to perform the operations
  private performOperation(operator: string, num1: number, num2: number) {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num2 - num1;
      case '*':
        return num1 * num2;
      case '/':
        return num2 / num1;
      default:
        throw new HttpException(
          {
            statusCode: 400,
            message: 'Invalid expression provided',
            error: 'Bad Request',
          },
          400,
        );
    }
  }

  //Method to evaluate the operations
  private evaluateExpression(numArr: number[], operators: string[]) {
    while (operators.length > 0) {
      const op = operators.pop();
      const num1 = numArr.pop();
      const num2 = numArr.pop();

      numArr.push(this.performOperation(op, num1, num2));
    }

    return numArr.pop();
  }
}
