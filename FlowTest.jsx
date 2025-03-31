
import React, { useState } from "react";

const FlowTest = () => {
  const questions = [
    {
      question: "새로운 사람을 만났을 때, 당신의 첫 반응은?",
      options: [
        "상대의 말과 태도를 유심히 관찰한다.",
        "친근하게 먼저 다가간다.",
        "거리를 두고 천천히 알아간다."
      ]
    },
    {
      question: "중요한 결정을 내릴 때, 당신은?",
      options: [
        "직감과 느낌을 믿는다.",
        "충분한 정보를 수집한 후 신중히 판단한다.",
        "주변 사람들의 의견을 듣고 조율한다."
      ]
    },
    {
      question: "예상치 못한 문제가 생겼을 때, 당신은?",
      options: [
        "바로 해결책을 찾으려 한다.",
        "상황을 지켜보며 흐름을 살핀다.",
        "주변과 상의하며 대안을 마련한다."
      ]
    },
    {
      question: "당신에게 ‘좋은 거래’란?",
      options: [
        "서로에게 이익이 되는 공정한 거래",
        "믿을 수 있는 사람과의 장기적 관계",
        "빠르고 효율적인 거래"
      ]
    },
    {
      question: "새로운 기회가 왔을 때, 당신은?",
      options: [
        "일단 도전해본다.",
        "충분히 검토하고 준비한 뒤 움직인다.",
        "주변 상황과 타인의 반응을 살핀다."
      ]
    }
  ];

  const results = [
    {
      title: "신뢰를 중시하는 안정형",
      description:
        "당신은 관계의 약속, 그리고 오래 가는 연결을 소중히 여깁니다. 빠른 선택보다, 신중한 연결을 통해 내 사람을 만들어갑니다.",
      quote: "좋은 거래는 결국 좋은 사람과의 연결에서 시작됩니다."
    },
    {
      title: "빠른 흐름을 선호하는 추진형",
      description:
        "당신은 기회를 기다리기보다 먼저 움직입니다. 빠른 결정과 행동 속에서 흐름을 만들어내는 사람입니다.",
      quote: "흐름은 기다리는 것이 아니라, 만들어가는 것입니다."
    },
    {
      title: "정보를 중시하는 분석형",
      description:
        "당신은 감정보다 사실과 근거를 우선합니다. 충분한 정보를 바탕으로 흐름의 방향을 판단하는 사람입니다.",
      quote: "흐름은 준비된 자에게 명확하게 보입니다."
    },
    {
      title: "사람과의 조화를 중시하는 공감형",
      description:
        "당신은 혼자보단 함께를 선택합니다. 주변과의 관계 속에서 흐름을 맞추고 조율하는 사람입니다.",
      quote: "좋은 흐름은 결국 좋은 사람들과의 조화에서 나옵니다."
    },
    {
      title: "새로움을 추구하는 도전형",
      description:
        "당신은 익숙한 것보다 새로운 가능성에 끌립니다. 익숙함을 벗어나 흐름을 바꾸고자 하는 사람입니다.",
      quote: "흐름은 바깥에서 오는 것이 아니라, 당신의 선택에서 시작됩니다."
    },
    {
      title: "흐름을 관찰하는 관망형",
      description:
        "당신은 서두르지 않습니다. 흐름의 변화를 지켜보며, 가장 적절한 때를 기다리는 사람입니다.",
      quote: "흐름은 조용히 지켜볼 때 더 선명하게 보입니다."
    },
    {
      title: "균형을 추구하는 중재형",
      description:
        "당신은 한쪽으로 치우치지 않습니다. 상황과 사람, 흐름 사이에서 균형점을 찾는 사람입니다.",
      quote: "흐름은 어느 한 방향이 아닌, 중심에서 만들어집니다."
    }
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleOptionClick = (option) => {
    setAnswers([...answers, option]);
    setStep(step + 1);
  };

  const calculateResult = () => {
    const score = answers.reduce((acc, answer) => acc + answer.length, 0);
    return results[score % results.length];
  };

  return (
    <div className="p-4 text-center text-white bg-black min-h-screen flex flex-col items-center justify-center">
      {step < questions.length ? (
        <div>
          <h1 className="text-xl mb-4">{questions[step].question}</h1>
          {questions[step].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="block bg-transparent border border-yellow-400 text-yellow-400 px-4 py-2 m-2 rounded"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl mb-2">{calculateResult().title}</h1>
          <p className="mb-4">{calculateResult().description}</p>
          <p className="italic mb-4">"{calculateResult().quote}"</p>
          <div>
            <a href="index.html" className="border border-yellow-400 text-yellow-400 px-4 py-2 m-2 rounded">다시 해보기</a>
            <a href="mk_philosophy.html" className="border border-yellow-400 text-yellow-400 px-4 py-2 m-2 rounded">나의 흐름 보기</a>
            <a href="mk_protocol.html" className="border border-yellow-400 text-yellow-400 px-4 py-2 m-2 rounded">MK Protocol 보기</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowTest;
