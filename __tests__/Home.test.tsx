import {render, screen} from "@testing-library/react";
import Home from "@/app/page";

it("Home was renderd correctly", () => {
	render(<Home />); //ARANGE

    const _ = screen.getByTestId("title") // ACT - Action we are taking

    expect(screen.getByTestId("title")).toBeInTheDocument(); //ASSERT
    expect(screen.getByTestId("cta-button")).toBeInTheDocument(); //ASSERT
});
