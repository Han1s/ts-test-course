import { render, screen } from "@testing-library/react";
import LoginComponent from "./LoginComponent";
import exp from "constants";

describe("Login component tests", () => {
  const loginServiceMock = {
    login: jest.fn(),
  };

  const setTokenMock = jest.fn();

  it("should render the login component", () => {
    const container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;

    console.log(container.innerHTML);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});
