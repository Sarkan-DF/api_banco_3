// Classe a ser testada;
class Calculadora {
  public somar(n1: number, n2: number) {
    return n1 + n2;
  }

  public multiplicar(n1: number, n2: number) {
    return n1 * n2;
  }
}

describe("Testando o comportamnto de Calculadora", () => {
  const createSut = () => {
    return new Calculadora();
  };

  test("deve resultar 10 ao somar 5 + 5 ", () => {
    const sut = createSut();
    const result = sut.somar(5, 5);
    expect(result).toBe(10);
  });

  test("deve resultar 50 ao multiplicar 10 * 5 ", () => {
    const sut = createSut();
    const result = sut.multiplicar(10, 5);
    expect(result).toBe(50);
  });
});
