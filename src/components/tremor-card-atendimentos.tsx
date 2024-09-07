import { useEffect, useMemo, useState } from "react";
import {
  BadgeDelta,
  Card,
  DeltaType,
  DonutChart,
  Select,
  SelectItem,
  Flex,
  Legend,
  List,
  ListItem,
  Title,
  Text,
  Divider,
} from "@tremor/react";

// icons

import { ChevronDown, ChevronUp } from "lucide-react";

type Atendimento = {
  name: string;
  delta: string;
  region: string;
  sales: number;
  deltaType: string;
  data: {
    cliente: {
      id: string;
      nome: string;
      services: {
        id: string;
        data: string;
        tipo: string;
        status: string;
        avaliacao: string;
      }[];
    };
    duration: string;
    status: string;
    tipo: string;
    observacao: string;
    tokens: number;

  };
};

const regions = [
  { key: "all", name: "All Regions" },
  { key: "us", name: "United States" },
  { key: "europe", name: "Europe" },
  { key: "asia", name: "Asia" },
];

const atendimentos = [
  {
    name: "Não avaliado",
    delta: "1.00%",
    region: "europe",
    sales: 20,
    deltaType: "increase",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Negativo",
    delta: "3.45%",
    region: "europe",
    sales: 20,
    deltaType: "moderateDecrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Positivo",
    delta: "1.90%",
    region: "europe",
    sales: 20,
    deltaType: "moderateIncrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  }, {
    name: "Não avaliado",
    delta: "1.00%",
    region: "us",
    sales: 20,
    deltaType: "increase",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Negativo",
    delta: "3.45%",
    region: "us",
    sales: 20,
    deltaType: "moderateDecrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Positivo",
    delta: "1.90%",
    region: "us",
    sales: 20,
    deltaType: "moderateIncrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Não avaliado",
    delta: "1.89%",
    region: "asia",
    sales: 15,
    deltaType: "increase",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Negativo",
    delta: "2.00%",
    region: "asia",
    sales: 10,
    deltaType: "moderateDecrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  },
  {
    name: "Positivo",
    delta: "1.00%",
    region: "asia",
    sales: 10,
    deltaType: "moderateIncrease",
    data: {
      cliente: {
        id: "1",
        nome: "João",
        services: [
          {
            id: "1",
            data: "2021-09-01",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 2 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "2",
            data: "2021-09-02",
            tipo: "Venda",
            status: "Concluído",
            observacao: "Cliente comprou 3 pizzas",
            avaliacao: "Positivo"
          },
          {
            id: "3",
            data: "2021-09-03",
            tipo: "Venda",
            status: "Concluído",
            avaliacao: "Positivo"
          }
        ]
      },
      duration: "1h 30m",
      status: "Concluído",
      tipo: "Venda",
      observacao: "Cliente comprou 2 pizzas",
      tokens: 2734,
    }
  }
];

const Format = (data: Atendimento[] | undefined): any[] => {

  if (!data) return []

  const groupedAtendimentos = data.reduce((result: Atendimento[], item) => {
    const { name, delta, region, sales, deltaType } = item;
    const existingItem = result.find(group => group.name === name);

    if (existingItem) {
      existingItem.sales += sales;
    } else {
      result.push({ name, delta, region, sales, deltaType, data: item.data });
    }

    return result;
  }, []);
  return groupedAtendimentos;
}

const filterByRegion = (region: string, data: Atendimento[]) => region === "all" ? data : data.filter((att: any) => att.region === region);

const valueFormatter = (number: any) => `${Intl.NumberFormat("us").format(number).toString()}`;

export default function TremorCardAtendimentos() {

  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filteredData, setFilteredData] = useState<Atendimento[]>();
  const [openIndexList, setOpenIndexList] = useState<boolean[]>(Array(atendimentos.length).fill(false));

  // Use useMemo para calcular filteredData e openIndexList quando selectedRegion muda
  const memoizedFilteredData = useMemo(() => {
    return filterByRegion(selectedRegion, atendimentos);
  }, [selectedRegion]);

  const memoizedOpenIndexList = useMemo(() => {
    return Array(atendimentos.length).fill(false);
  }, [atendimentos]);

  useEffect(() => {
    // Atualize o estado com os valores memoizados
    setFilteredData(memoizedFilteredData);
    setOpenIndexList(memoizedOpenIndexList);
  }, [memoizedFilteredData, memoizedOpenIndexList]);

  const toggleOpenIndex = (index: number) => {
    const newOpenIndexList = [...openIndexList];
    newOpenIndexList[index] = !openIndexList[index];
    setOpenIndexList(newOpenIndexList);
  };

  return (
    <Card className="justify-around mx-auto w-1/3">
      <Flex className="h-3/4 space-y-2 flex-col">
        <Flex className="flex-col">
          <Title className="font-bold">Atendimentos</Title>
          <Select onValueChange={setSelectedRegion} placeholder="Região">
            {regions.map((region) => (
              <SelectItem key={region.key} value={region.key}>
                {region.name}
              </SelectItem>
            ))}
          </Select>
        </Flex>
        <Legend categories={Format(filteredData).map((att) => att.name)} className="justify-center w-full" />
        <DonutChart
          data={Format(filteredData)}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
        />
        <Flex className="justify-between my-6 w-full">
          <Text className="font-bold">Região</Text>
          <Text className="font-bold">Quantidade: {filteredData?.length}</Text>
        </Flex>
      </Flex>
      <List className="no-scrollbar overflow-scroll h-1/4 ">
        {filteredData?.map((att, index) => (
          <ListItem key={att.name} className="flex flex-col w-full p-2">
            <div className="flex flex-row justify-between items-center w-full">
              {att.region}
              <div className="flex-row flex gap-2">
                <BadgeDelta deltaType={att.deltaType} size="xs">
                  {att.delta}
                </BadgeDelta>
                {openIndexList[index] ? <ChevronUp onClick={() => toggleOpenIndex(index)} /> : <ChevronDown onClick={() => toggleOpenIndex(index)} />}
              </div>
            </div>
            {openIndexList[index] && (
              <>
                <Divider className="my-2" />
                <div className="flex flex-col gap-2 w-full">
                  <Title className="w-full">Cliente</Title>
                  <div className="w-full flex flex-row justify-between break-words gap-2">
                    <div className="w-1/2">
                      <Text>Nome: {att.data.cliente.nome}</Text>
                      <Text>Duração: {att.data.duration}</Text>
                      <Text>Status: {att.data.status}</Text>
                    </div>
                    <div className="">
                      <Text>Tipo: {att.data.tipo}</Text>
                      <Text>Tokens: {att.data.tokens}</Text>
                      <Text>Atendimentos: {att.data.cliente.services.length}</Text>
                    </div>
                  </div>
                </div>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Card>
  );
}