import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import { Flex, Container, Button, Text, TextInput, Space, Group, Stack } from "@mantine/core";
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';


const descriptionText = "The link should start with \"https://\" or \"http://\""

const schema = z.object({
    url: z.string().url({ message: descriptionText })
    .optional()
    .or(z.literal('')),
});

interface FormValues {
    url: string | undefined; // regular field, same as inferred type
  }

function App() {
  
  const form = useForm({
    initialValues: {
      url: ''
    },
    validateInputOnChange: true,
    validate: zodResolver(schema),
    clearInputErrorOnChange: true 
  });

  const [ loading, setLoading ] = React.useState(false)
  const [ componentsAmount, setComponentsAmount ] = React.useState(0)
  const [ isSelectionValid, setIsSelectionValid ] = React.useState(true)

  
   // Get inferred form values type, will be `{ name: string | null }`
   type FormValues = typeof form.values


   // Use values type in handleSubmit function or anywhere else
   const handleSubmit = (value: FormValues) => {
    
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            parent.postMessage({ pluginMessage: { 
                type: "apply",
                data: value
            } }, "*");         
            form.reset()
        }, 1000)

   };

   onmessage = ({ data }) => {

    const { state, amount } = data.pluginMessage

    switch (state) {
        case 'SELECTION_ALLOWED':
          setComponentsAmount(amount)
          setIsSelectionValid(true)
          break;
        case 'SELECTION_NOT_ALLOWED':
            setComponentsAmount(0)
            setIsSelectionValid(false)
          break;
        case 'NOTHING_SELECTED':
            setComponentsAmount(0) 
            setIsSelectionValid(true)
            break;
        default:
          console.log(`No message received.`);
        }
   
    }

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>

        <Container
        size="m"
        px="24"
        style={{
            "paddingTop": 24,
            "width": "100%",
        }}
    >
        <Flex
            gap="md"
            direction="column"
            justify="center"
            rowGap="md"
            align="center"
        >
            <Stack
                bg="var(--mantine-color-blue-light)"
                justify="center"
                h={50}
            >

        { isSelectionValid ?
            <Text
            size="xs"
            >       
            <b>{componentsAmount}</b> component(s) selected
            </Text>
             :
             <Text size="xs" c="red" align="center">
                You must only select main components or components set.
            </Text>
        }

        </Stack>
          
            
            <form onSubmit={form.onSubmit(handleSubmit)}>                       
                    <TextInput
                        placeholder="Link to documentation"
                        {...form.getInputProps('url')}
                        aria-label="Documentation link"
                        description={ descriptionText }
                        inputWrapperOrder={['label', 'input', 'description']}
                        styles={{
                            description: {
                              color: !form.isValid() && "red"
                            },
                        }}
                    />
                    <Space h="md"/>
                    <Button
                        disabled={ form.isValid() && componentsAmount > 0 ? false : true }
                        variant="filled"
                        fullWidth={ true }
                        className="brand"
                        type="submit"
                        loading={loading}
                        radius="md"
                        style={{
                            "fontSize": "12px"
                        }}
                        >
                    
                        Update Link
                    </Button>
                
            
            </form>            
        </Flex>
       
        <Group justify="space-between" preventGrowOverflow={false} style={{"width": "100%"}}>
            {/* <Text c="dimmed" size="xs" style={{"fontSize": "8px"}}> Created and maintained by <a href="https://www.linkedin.com/rdaud">Rodrigo Daud</a></Text> */}
            <Text c="dimmed" size="xs" style={{"fontSize": "8px"}}> v1.0.1</Text>
        </Group>
       

    </Container>
            
            
    

           
        </MantineProvider>
    );
  }

const root = ReactDOM.createRoot(document.getElementById("react-page"));
root.render(<App/>)



