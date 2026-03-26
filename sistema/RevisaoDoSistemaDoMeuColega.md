# Revisão do Sistema de Thiago Conte Rocha (tcr2)

## Revisão do Sistema

**O sistema está funcionando com as funcionalidades solicitadas?**

- ✅ Eu consigo criar, editar e excluir questões
- ✅ Eu consigo criar, editar e excluir alternativas para as questões
- ✅ Eu consigo criar provas a partir das questões criadas
- ✅ Eu consigo gerar PDFs das provas criadas com variação da ordem das questões e alternativas
- ✅ Eu consigo calcular a nota de uma prova a partir de um csv com as respostas do aluno com diferentes niveis de rigor
- ❌ Eu não consigo editar ou excluir provas (eu posso editar as questões para criar novas provas, mas não consigo editar ou excluir as provas já criadas)
- ❌ Eu não consigo escolher se as questões devem ser identificadas por letras ou potências de 2
- ❌ Os PDFs gerados não estão formatados corretamente (id não aparece no fim de cada página)

**Quais os problemas de qualidade do código e dos testes?**

- Alguns casos de formatação inconsistente (identação, espaçamento)
- Pouco uso de componentes reutilizáveis, o que pode levar a código mais difícil de manter
- Pouca documentação, dificultando a compreensão imediata do código para novos desenvolvedores
- Testes de aceitação quase inexistentes (apenas uma feature com um cenário)
- Nenhum outro tipo de teste (unitário, integração, etc.) presente

**Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu sistema?**

- Possui persistência de dados, o que é um diferencial em relação ao meu sistema
- Boa parte da interface está em um único componente, enquanto no meu sistema há uma divisão maior de componentes entre diferentes páginas, o que pode facilitar a manutenção
- O meu sistema possui mais testes, tanto de aceitação quanto unitários, o que pode contribuir para uma maior confiabilidade e facilidade de manutenção a longo prazo
- Apenas um PDF é gerado com todas as variações de questões e alternativas, enquanto no meu sistema cada prova é gerada em um PDF separado


## Revisão do Histórico de Desenvolvimento

**Estratégias de interação utilizadas**

- Se baseou nos prompts de exemplo
- Foco em descrever os requisitos e necessidades do sistema
- Usou direcionamentos para estilos de organização do código e design da interface

**Situações em que o agente funcionou melhor ou pior**

- ✅ Funcionou melhor em:
    - prompts com tarefas isoladas, tarefas mais simples e diretas, como alterações na UI
- ❌ Funcionou pior em:
    - resolução de bugs e tarefas com requisitos mais complexos, como a lógica de cálculo das notas

**Tipos de problemas observados**

- É difícil analisar com a pequena quantidade de interações, mas o agente aparentou ter dificuldade em entender especificações mais complexas e em lidar com bugs

**Avaliação geral da utilidade do agente no desenvolvimento**

- O agente foi capaz de gerar o sistema e cumprir boa parte dos requisitos, mostrando ser uma ferramenta útil para desenvolver um sistema mais simples. Contudo, ele não parece ser capaz de lidar com requisitos mais complexos, deixando uma dúvida sobre sua utilidade em sistemas no mundo real.

**Comparação com a sua experiência de uso do agente**

- Minha experiência com o agente foi mais prolongada, com mais interações e mais variedade de tarefas. Por definir um ambiente mais complexo, com múltiplos `AGENT.md` e skills, tive a oportunidade de explorar diferentes aspectos do agente.
- Apesar disso, o agente também apresentou dificuldades similares às relatadas acima, principalmente ao lidar com prompts mais complexos e com múltiplas tarefas.
- Dessa forma, minha avaliação geral se aproxima da noção de que o agente é util para tarefas mais simples, mas por explorar mais a fundo suas capacidades, eu consegui com que ele cumprisse requisitos mais complexos ao longo do desenvolvimento.