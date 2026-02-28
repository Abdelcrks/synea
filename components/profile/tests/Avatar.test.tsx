import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/image", () => {
  return {
    default: (props: any) => {
      const { fill, ...rest } = props; // on enlève fill
      return <img {...rest} />; // ✅ utiliser rest, pas props
    },
  };
});
import { Avatar } from "../Avatar"; 

describe("Avatar", () => {
  it("shows initials when avatarUrl is missing", () => {
    render(<Avatar name="Abdel Berkat" avatarUrl={null} />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders an image when avatarUrl is provided", () => {
    render(<Avatar name="Abdel Berkat" avatarUrl="https://example.com/a.png" />);
    const img = screen.getByRole("img", { name: "Avatar de Abdel Berkat" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/a.png");
  });

  it("for a single-word name, shows first 2 letters", () => {
    render(<Avatar name="Abdel" avatarUrl={null} />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });
});