import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api";

const Facilities = ({
  prevStep,
  propertyDetails = {
    facilities: { bedrooms: 0, parkings: 0, bathrooms: 0 },
  },
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  // Form initialization
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms || 0,
      parkings: propertyDetails.facilities.parkings || 0,
      bathrooms: propertyDetails.facilities.bathrooms || 0,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? "Must have at least one bedroom" : null),
      bathrooms: (value) =>
        value < 1 ? "Must have at least one bathroom" : null,
      parkings: (value) =>
        value < 0 ? "Number of parkings cannot be negative" : null,
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;

  // User and context
  const { user } = useAuth0();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const { refetch: refetchProperties } = useProperties();

  // Mutation for creating residency
  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      createResidency(
        {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
        },
        token
      ),
    onError: ({ response }) =>
      toast.error(response?.data?.message || "An error occurred", {
        position: "bottom-right",
      }),
    onSettled: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
      // Reset form and state
      setPropertyDetails({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        image: null,
        facilities: {
          bedrooms: 0,
          parkings: 0,
          bathrooms: 0,
        },
        userEmail: user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    },
  });

  // Form submit handler
  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms },
      }));
      mutate();
    }
  };

  return (
    <Box maw="30%" mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label="Number of Bedrooms"
          min={1}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label="Number of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          withAsterisk
          label="Number of Bathrooms"
          min={1}
          {...form.getInputProps("bathrooms")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;
