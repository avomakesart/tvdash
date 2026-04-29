import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SearchBar from "@/components/SearchBar.vue";

describe("SearchBar", () => {
  it("renders an input element", () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "" } });
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("reflects the modelValue in the input", () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "breaking" } });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("breaking");
  });

  it("emits update:modelValue with the new value on input", async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "" } });
    await wrapper.find("input").setValue("succession");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["succession"]);
  });

  it("renders the search icon", () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "" } });
    expect(wrapper.find(".icon").exists()).toBe(true);
  });
});
