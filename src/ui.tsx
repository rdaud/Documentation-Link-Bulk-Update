import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import { Flex, Container, Button, Text, TextInput, Space } from "@mantine/core";



function App() {

    const [ buttonState, setButtonState ] = React.useState(false);
    const [ value, setValue ] = React.useState('');

    const onApply = () => {
        parent.postMessage({ pluginMessage: { 
            type: "apply",
            data: value
         } }, "*");

         // Clear input
         setValue('')
    };

    function checkURL() {
        const pattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
        console.log(pattern.test(value))

    }

  React.useEffect(() => {
    checkURL()
  },[value])

    onmessage = ({ data }) => {
        if (data.pluginMessage === 'Component selected') {
            setButtonState(true)
        } else if (data.pluginMessage === 'Component not selected') {
            setButtonState(false)
        } else {
            setButtonState(false)
        }
    }

  
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Container
                size="m"
                px="24"
                style={{
                    "paddingTop": 24,
                    "paddingBottom": 24,
                    "height": 120
                }}
            >
                <Flex
                    gap="md"
                    direction="column"
                    justify="center"
                    rowGap="md"
                >
                    <Text
                        fz="sm"
                    >
                        Add the documentation link and click apply.
                    </Text>
                       
                            <TextInput
                                type="url"
                                placeholder="https://amazingdesignsystem.com/components"
                                value={value}
                                onChange={(event) => setValue(event.currentTarget.value)}
                                pattern="/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
                                "
                                error={buttonState ? true : false}
                            />
                    
                    <Space />
                    <footer>
                        {
                            !!buttonState ?
                            
                            <Button
                                variant="filled"
                                onClick={onApply}
                                fullWidth={true}
                                className="brand"
                            >
                            Apply
                            </Button> :
                            <Button
                                disabled
                                variant="filled"
                                onClick={onApply}
                                fullWidth={true}
                                className="brand"
                            >
                                Apply
                            </Button>
                        }
                            
                    </footer>
                </Flex>
            </Container>  
        </MantineProvider>
    );
  }

const root = ReactDOM.createRoot(document.getElementById("react-page"));
root.render(<App/>)



