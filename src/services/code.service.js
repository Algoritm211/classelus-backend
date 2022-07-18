const axios = require('axios')


class CodeService {
  async #runCode({ language, code, rawTests, logFunc }) {
    let isCodeValid = true
    const splitter = '|'
    let errorMsg = ''

    const testsBody = rawTests.map((testObj) => {
      if (testObj.test.includes('(') && testObj.test.includes(')')) {
        return testObj.test
      }
      return `\"${testObj.test}\"`
    }).join(`, '${splitter}' ,`)

    const tests = `${logFunc}(${testsBody})`

    const codeForRun = `${code}\n\n${tests}`

    const programBody = {
      script: codeForRun,
      language,
      versionIndex: '0',
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    }

    const { data: execCodeData } = await axios.post('https://api.jdoodle.com/v1/execute', programBody)

    if (execCodeData.output.includes('Error') ||
      execCodeData.output.includes('error') ||
      execCodeData.output.includes('__dirName')) {
      errorMsg = execCodeData.output
    }

    const results = execCodeData.output.split(' \'|\' ').map((elem) => elem.replace('\n', ''))

    results.forEach((res, index) => {
      if (rawTests[index]?.expected !== res && !res.includes(rawTests[index].expected)) {
        if (!errorMsg) {
          errorMsg += `Wrong output for ${rawTests[index]?.test}\n`
        }
        isCodeValid = false
      }
    })

    return {
      isValid: isCodeValid,
      statusCode: execCodeData.statusCode,
      memory: execCodeData.memory,
      cpuTime: execCodeData.cpuTime,
      errorMessage: errorMsg,
    }
  }

  runPythonCode(code, rawTests) {
    return this.#runCode({
      code,
      rawTests,
      language: 'python3',
      logFunc: 'print',
    })
  }

  runJSCode(code, rawTests) {
    return this.#runCode({
      code,
      rawTests,
      language: 'nodejs',
      logFunc: 'console.log',
    })
  }
}

module.exports = new CodeService()
