# Peper-Analysis

![Peper-Analysis_logo](./public/img/logo10.png)

An intelligent analyzer and visualizer of natural language reviews from [AirBNB](https://www.airbnb.com) and [TripAdvisor](https://www.tripadvisor.com).

## How to install and run the app?

We are using Python and JavaScript as main programming languages, so we will have to setup both sides in order
to run the app.

### Installation

1) Since our back-end is written using `Node.js`, you will need to download it from [here](https://nodejs.org/en/).
2) Once you have `Node.js` you will need to install the packages we used to build this project, specified in `package.json`.
<br>Navigate to the root directory of the project and run the following:
    ```bash
    npm install
    ```
3) Now, that we are done with JavaScript's dependencies, lets continue with Python's.
Of course you will need to download the Python programming language. You can do so from [here](https://www.python.org/downloads/release/python-372/).
4) Now, because we are using virtual environment to manage our dependencies, you will need to download `Pipenv`.
<br> Check out [here](https://pipenv.readthedocs.io/en/latest/install/#installing-pipenv) to understand how to do so.
5) Once you have installed `Pipenv` you are ready to install the requirements specified in the `Pipfile`.
<br>Navigate to the root directory of the project and run the following:
    ```bash
    pipenv install
    ```
6) Good Job! Now you are all setup to run the app.

### Running

* Navigate to the root directory of the project and run the following:
    ```bash
    node index.js [path_to_the_python_executable]
    ```

* You can get your `path_to_the_python_executable` by running:
    ```bash
    pipenv --venv
    ```
This will return a path, add `/bin/python` to this path and this whole string pass to `node index.js`.
* For a shortcut you can try running this:
    ```bash
    node index.js $(pipenv --venv)/bin/python
    ```

## Built With

* [Node.js](https://nodejs.org/en/) - The back-end framework used

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Victor Velev** - *Initial work* - [VIVelev](https://github.com/VIVelev)
* **Kaloyan Madjunov** - *Initial work* - [kall0m](https://github.com/kall0m)
* **Telerik Arsov** - *Initial work* - [NotGayBut5CentsAre5Cents](https://github.com/NotGayBut5CentsAre5Cents)
* **Martin Datsev** - *Initial work* - [mdatsev](https://github.com/mdatsev)
* **Vladislav Georgiev** - *Initial work* - [VGeorgiev1](https://github.com/VGeorgiev1)
* **Peter Milev** - *Initial work* - [Pe6oProgramista](https://github.com/Pe6oProgramista)


See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
