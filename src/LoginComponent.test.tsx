/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import { act, fireEvent, render, screen } from "@testing-library/react";
import LoginComponent from "./LoginComponent";
import user from "@testing-library/user-event";

describe("Login component tests", () => {
  const loginServiceMock = {
    login: jest.fn(),
  };

  const setTokenMock = jest.fn();

  let container: HTMLElement;

  const setup = () => {
    container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;
  };

  beforeEach(() => {
    setup();
  });

  it("should render the login component", () => {
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(screen.queryByTestId("resultLabel")).not.toBeInTheDocument();
  });

  it("should render correctly query by testId", () => {
    const inputs = screen.getAllByTestId("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].getAttribute("value")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("Login");
  });

  it("should render correctly - query by document query", () => {
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].getAttribute("value")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("Login");
  });

  it("click login button with incomplete credentials - show required message", () => {
    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];

    fireEvent.click(loginButton);
    const resultLabel = screen.getByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("UserName and password required!");
  });

  it("click login button with incomplete credentials - show required message - with user click", () => {
    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];

    act(() => {
      user.click(loginButton);
    });

    const resultLabel = screen.getByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("UserName and password required!");
  });

  it("right credentilas - successful login", async () => {
    loginServiceMock.login.mockResolvedValueOnce("123");

    const inputs = container.querySelectorAll("input");

    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePassword" } });
    fireEvent.click(loginButton);

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const reultsLabel = await screen.findByTestId("resultLabel");
    expect(reultsLabel.textContent).toBe("successful login");
  });

  it("right credentilas - successful login - with user calls", async () => {
    loginServiceMock.login.mockResolvedValueOnce("123");

    const inputs = container.querySelectorAll("input");

    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    act(() => {
      user.click(userNameInput);
      user.keyboard("someUser");

      user.click(passwordInput);
      user.keyboard("somePassword");

      user.click(loginButton);
    });

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const reultsLabel = await screen.findByTestId("resultLabel");
    expect(reultsLabel.textContent).toBe("successful login");
  });

  it("wrong credentilas - unsuccessful login", async () => {
    loginServiceMock.login.mockResolvedValueOnce(undefined);

    const inputs = container.querySelectorAll("input");

    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    act(() => {
      user.click(userNameInput);
      user.keyboard("someUser");

      user.click(passwordInput);
      user.keyboard("somePassword");

      user.click(loginButton);
    });

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const reultsLabel = await screen.findByTestId("resultLabel");
    expect(reultsLabel.textContent).toBe("invalid credentials");
  });
});
