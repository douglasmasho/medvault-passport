import { useState } from "react";
import SettingSection from "./SettingSection";
import { Eclipse } from "lucide-react";
import ToggleSwitch2 from "./ToggleSwitch2";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context

const ToggleMode = () => {
	const [notifications, setNotifications] = useState({
		push: true,
		email: false,
		sms: true,
	});
	const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode context
	

	return (
		<SettingSection icon={Eclipse} title={"Light/Dark Mode"}>
			<ToggleSwitch2
				// label={"Dark Mode"}
				isOn={isDarkMode}
				onToggle={toggleDarkMode}
			/>
		</SettingSection>
	);
};
export default ToggleMode;
