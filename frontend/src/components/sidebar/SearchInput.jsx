import { FiSearch } from "react-icons/fi";
import useConversation from "../../zustand/useConversation";
import { TextInput } from "@mantine/core";

const SearchInput = () => {
    const { searchTerm, setSearchTerm } = useConversation();

    const handleSearchChange = (e) => {
        setSearchTerm(e.currentTarget.value);
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
            <TextInput
                placeholder="Search conversations…"
                value={searchTerm}
                onChange={handleSearchChange}
                leftSection={<FiSearch size={18} />}
                radius="xl"
                size="md"
                w="100%"
            />
        </form>
    );
};

export default SearchInput;
